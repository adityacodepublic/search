Brew Services 👇

---

### 🧩 1. Command Meaning

When you run:

```bash
brew services start typesense-server@29.0
```

You’re telling **Homebrew** to start the `typesense-server@29.0` service **via `brew services`**, which uses **macOS’s `launchctl`** under the hood.

That means:

* It **starts immediately**, and
* It is **registered to start automatically at login (boot)** for your user (or system-wide if you used `sudo`).

So yes — ✅ **it will keep running persistently** and restart after reboots or user logins.

---

### ⚙️ 2. How to Manage the Service

**Start the service:**

```bash
brew services start typesense-server@29.0
```

**Stop the service:**

```bash
brew services stop typesense-server@29.0
```

**Restart the service:**

```bash
brew services restart typesense-server@29.0
```

**Check status of all services:**

```bash
brew services list
```

This shows which ones are started, stopped, and whether they’re set to start at login or system boot.

---

### 🔁 3. Does it start automatically on boot?

* ✅ **Yes**, if you started it with `brew services start ...`, it will automatically start **every time you log in** (for your user).
* 🧑‍💻 If you want it to run for **all users** (system-wide, even before login), you can do:

  ```bash
  sudo brew services start typesense-server@29.0
  ```

  That registers it as a system service.

---

### 🧹 4. To remove it from auto-start

If you ever want to disable auto-start (but not uninstall):

```bash
brew services stop typesense-server@29.0
```

If you want to **remove it completely** from the launchctl list:

```bash
brew services cleanup
```

---

### ✅ Summary

| Action         | Command                                          | Starts on Boot?   |
| -------------- | ------------------------------------------------ | ----------------- |
| Start (user)   | `brew services start typesense-server@29.0`      | Yes (user login)  |
| Start (system) | `sudo brew services start typesense-server@29.0` | Yes (system boot) |
| Stop           | `brew services stop typesense-server@29.0`       | No                |
| Restart        | `brew services restart typesense-server@29.0`    | Yes               |
| List           | `brew services list`                             | —                 |

---
**Typesense manually**

For macOS running on Intel CPUs:

- The default API key is xyz and the default port is 8108
- The config file is at /usr/local/etc/typesense/typesense.ini
- Logs are under /usr/local/var/log/typesense/
- Data dir is under /usr/local/var/lib/typesense/
- For macOS running on Apple Silicon CPUs:

- The default API key is xyz and the default port is 8108
- The config file is at /opt/homebrew/etc/typesense/typesense.ini
- Logs are under /opt/homebrew/var/log/typesense/
- Data dir is under /opt/homebrew/var/lib/typesense/
