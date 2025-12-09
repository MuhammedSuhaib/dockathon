from collections import defaultdict
from chatkit.store import NotFoundError, Store
from chatkit.types import Attachment, Page, ThreadItem, ThreadMetadata


class MyChatKitStore(Store[dict]):
    def __init__(self):
        self.threads: dict[str, ThreadMetadata] = {}
        self.items: dict[str, list[ThreadItem]] = defaultdict(list)

    async def load_thread(self, thread_id: str, context: dict) -> ThreadMetadata:
        if thread_id not in self.threads:
            raise NotFoundError(f"Thread {thread_id} not found")
        return self.threads[thread_id]

    async def save_thread(self, thread: ThreadMetadata, context: dict) -> None:
        self.threads[thread.id] = thread

    async def load_threads(self, limit, after, order, context):
        threads = list(self.threads.values())
        return self._paginate(
            threads, after, limit, order,
            sort_key=lambda t: t.created_at,
            cursor_key=lambda t: t.id
        )

    async def load_thread_items(self, thread_id, after, limit, order, context):
        items = self.items.get(thread_id, [])
        return self._paginate(
            items, after, limit, order,
            sort_key=lambda i: i.created_at,
            cursor_key=lambda i: i.id
        )

    async def add_thread_item(self, thread_id, item, context):
        self.items[thread_id].append(item)

    async def save_item(self, thread_id, item, context):
        rows = self.items[thread_id]
        for i, old in enumerate(rows):
            if old.id == item.id:
                rows[i] = item
                return
        rows.append(item)

    async def load_item(self, thread_id, item_id, context):
        for item in self.items.get(thread_id, []):
            if item.id == item_id:
                return item
        raise NotFoundError(f"Item {item_id} not found")

    async def delete_thread(self, thread_id, context):
        self.threads.pop(thread_id, None)
        self.items.pop(thread_id, None)

    async def delete_thread_item(self, thread_id, item_id, context):
        self.items[thread_id] = [
            i for i in self.items.get(thread_id, []) if i.id != item_id
        ]

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

    # attachments not needed for demo
    async def save_attachment(self, *a, **k):
        raise NotImplementedError()

    async def load_attachment(self, *a, **k):
        raise NotImplementedError()

    async def delete_attachment(self, *a, **k):
        raise NotImplementedError()
