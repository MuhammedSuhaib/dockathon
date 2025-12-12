import json
import os
import subprocess
from pathlib import Path

# --- Configuration ---
USER_PROFILE = Path.home()
QWEN_CREDS_PATH = USER_PROFILE / ".qwen" / "oauth_creds.json"
CCR_CONFIG_PATH = USER_PROFILE / ".claude-code-router" / "config.json"
PROVIDER_NAME = "qwen"

# Simple logging function
def log_message(msg):
    # This will write simple log messages to a file next to the script
    log_file = Path(__file__).parent / "refresh_log.txt"
    with open(log_file, 'a') as f:
        f.write(f"{os.path.basename(__file__)} [{os.popen('date /t').read().strip()} {os.popen('time /t').read().strip()}] - {msg}\n")
    print(msg) # Also print to console if running interactively

log_message("Starting Qwen Access Token Refresh...")

try:
    # 1. Extract the new access_token
    with open(QWEN_CREDS_PATH, 'r') as f:
        qwen_creds = json.load(f)
    new_token = qwen_creds.get("access_token")
    if not new_token:
        raise ValueError("Could not find 'access_token' in Qwen credentials.")

    log_message(f"✅ Extracted new token: {new_token[:8]}...")

    # 2. Update the CCR config.json
    with open(CCR_CONFIG_PATH, 'r') as f:
        ccr_config = json.load(f)

    provider_found = False
    for provider in ccr_config.get("Providers", []):
        if provider.get("name") == PROVIDER_NAME:
            provider["api_key"] = new_token
            provider_found = True
            break
            
    if not provider_found:
        raise ValueError(f"Provider '{PROVIDER_NAME}' not found in CCR config.")
        
    # Write the updated config back
    # Use indent=4 for human readability
    with open(CCR_CONFIG_PATH, 'w') as f:
        json.dump(ccr_config, f, indent=4)
        
    log_message("✅ Successfully updated CCR config.")

    # 3. Restart the Claude Code Router
    log_message("🔄 Restarting ccr...")
    # Use shell=True for `ccr` command to be recognized from PATH
    subprocess.run(["ccr", "restart"], check=True, shell=True, capture_output=True, text=True)
    log_message("Done. Router restarted.")

except FileNotFoundError as e:
    log_message(f"❌ Error: Required file not found. Check path: {e.filename}")
except ValueError as e:
    log_message(f"❌ Error in JSON structure: {e}")
except subprocess.CalledProcessError as e:
    log_message(f"❌ Error: Failed to run 'ccr restart'. Ensure 'ccr' is in your system PATH. Output: {e.stderr}")
except Exception as e:
    log_message(f"❌ An unexpected error occurred: {e}")


# C:\Users\giaic\.claude-code-router\config.json
# C:\Users\giaic\.qwen\oauth_creds.json