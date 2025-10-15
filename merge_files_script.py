#!/usr/bin/env python3
import os
import fnmatch

OUTPUT_FILE = "all_in_one.txt"
IGNORE_FILE = ".mergeignore"

def load_ignore_patterns(base_dir="."):
    ignore_path = os.path.join(base_dir, IGNORE_FILE)
    patterns = []
    if os.path.exists(ignore_path):
        with open(ignore_path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith("#"):
                    continue
                patterns.append(line)
    return patterns


def is_ignored(path, patterns):
    for pattern in patterns:
        if fnmatch.fnmatch(path, pattern):
            return True
    return False


def merge_files(base_dir="."):
    patterns = load_ignore_patterns(base_dir)
    with open(OUTPUT_FILE, "wb") as outfile:
        for root, dirs, files in os.walk(base_dir):
            for name in files:
                filepath = os.path.join(root, name)
                relpath = os.path.relpath(filepath, base_dir)

                # исключаем сам результирующий файл
                if os.path.abspath(filepath) == os.path.abspath(OUTPUT_FILE):
                    continue
                # исключаем игнорируемые файлы
                if is_ignored(relpath, patterns):
                    continue

                header = f"# {relpath}\n".encode("utf-8")
                outfile.write(header)

                try:
                    with open(filepath, "rb") as f:
                        outfile.write(f.read())
                except Exception as e:
                    error_msg = f"\n# [Ошибка чтения: {e}]\n".encode("utf-8")
                    print(error_msg)

                outfile.write(b"\n\n")  # разделитель между файлами


if __name__ == "__main__":
    merge_files(".")
