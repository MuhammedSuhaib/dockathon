from collections import defaultdict
import uuid
from datetime import datetime
from typing import Optional
from chatkit.store import NotFoundError, Store
from chatkit.types import Page, ThreadItem, ThreadMetadata, UserMessageItem, AssistantMessageItem


class MyChatKitStore(Store[dict]):
    def __init__(self):
        self.threads: dict[str, ThreadMetadata] = {}
        self.items: dict[str, list[ThreadItem]] = defaultdict(list)

    def generate_thread_id(self, context: dict) -> str:
        return f"thread_{uuid.uuid4().hex[:12]}"

    def generate_item_id(self, item_type: str, thread: ThreadMetadata, context: dict) -> str:
        return f"{item_type}_{uuid.uuid4().hex[:12]}"

    async def load_thread(self, thread_id: str, context: dict) -> ThreadMetadata:
        if thread_id not in self.threads:
            raise NotFoundError(f"Thread {thread_id} not found")
        return self.threads[thread_id]

    async def save_thread(self, thread: ThreadMetadata, context: dict) -> None:
        self.threads[thread.id] = thread

    async def load_thread_items(self, thread_id: str, after: Optional[str], limit: int, order: str, context: dict) -> Page[ThreadItem]:
        items = self.items.get(thread_id, [])
        return self._paginate(
            items, after, limit, order,
            sort_key=lambda i: i.created_at if hasattr(i, 'created_at') else datetime.now(),
            cursor_key=lambda i: i.id
        )

    async def add_thread_item(self, thread_id: str, item: ThreadItem, context: dict) -> None:
        if thread_id not in self.items:
            self.items[thread_id] = []
        self.items[thread_id].append(item)

    async def save_item(self, thread_id: str, item: ThreadItem, context: dict) -> None:
        items = self.items[thread_id]
        for i, old in enumerate(items):
            if old.id == item.id:
                items[i] = item
                return
        items.append(item)

    async def load_item(self, thread_id: str, item_id: str, context: dict) -> ThreadItem:
        for item in self.items.get(thread_id, []):
            if item.id == item_id:
                return item
        raise NotFoundError(f"Item {item_id} not found")

    async def delete_thread_item(self, thread_id: str, item_id: str, context: dict) -> None:
        self.items[thread_id] = [
            i for i in self.items.get(thread_id, []) if i.id != item_id
        ]

    async def delete_thread(self, thread_id: str, context: dict) -> None:
        self.threads.pop(thread_id, None)
        self.items.pop(thread_id, None)

    async def load_threads(self, limit: int, after: Optional[str], order: str, context: dict) -> Page[ThreadMetadata]:
        threads = list(self.threads.values())
        return self._paginate(
            threads, after, limit, order,
            sort_key=lambda t: t.created_at if hasattr(t, 'created_at') else datetime.now(),
            cursor_key=lambda t: t.id
        )

    # Required attachment methods
    async def save_attachment(self, attachment, context: dict) -> None:
        # For a simple implementation, we don't store attachments
        pass

    async def load_attachment(self, attachment_id: str, context: dict):
        # Raise an error since we don't have this attachment
        raise NotFoundError(f"Attachment {attachment_id} not found")

    async def delete_attachment(self, attachment_id: str, context: dict) -> None:
        # Nothing to delete since we don't store attachments
        pass

    def _paginate(self, rows, after, limit, order, sort_key, cursor_key):
        sorted_rows = sorted(rows, key=sort_key, reverse=order == "desc")
        start = 0
        if after:
            for i, row in enumerate(sorted_rows):
                if cursor_key(row) == after:
                    start = i + 1
                    break
        data = sorted_rows[start:start + limit]
        has_more = start + limit < len(sorted_rows)
        next_after = cursor_key(data[-1]) if has_more and data else None
        return Page(data=data, has_more=has_more, after=next_after)
