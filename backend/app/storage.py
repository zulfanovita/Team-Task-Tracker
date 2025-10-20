"""Modul penyimpanan data sederhana berbasis file JSON untuk Team Task Tracker."""

import json
import threading
from pathlib import Path


class Storage:
    """Kelas untuk menangani penyimpanan data menggunakan file JSON."""

    def __init__(self, path="./db.json"):
        """Inisialisasi storage dengan path file JSON dan lock threading."""
        self.path = Path(path)
        self.lock = threading.Lock()
        if not self.path.exists():
            self._init()

    def _init(self):
        """Membuat file JSON baru dengan struktur dasar jika belum ada."""
        base = {"tasks": [], "logs": []}
        self._write(base)

    def _read_all(self):
        """Membaca seluruh isi file JSON dan mengembalikannya sebagai dict."""
        with self.lock:
            with open(self.path, "r", encoding="utf-8") as f:
                return json.load(f)

    def _write(self, data):
        """Menulis data dict ke file JSON dengan format yang rapi."""
        with self.lock:
            with open(self.path, "w", encoding="utf-8") as f:
                json.dump(data, f, ensure_ascii=False, indent=2)

    def read(self, key):
        """Membaca elemen tertentu (misal 'tasks' atau 'logs') dari file JSON."""
        data = self._read_all()
        return data.get(key, [])

    def append(self, key, obj):
        """Menambahkan objek baru ke dalam list tertentu di file JSON."""
        data = self._read_all()
        data.setdefault(key, []).append(obj)
        self._write(data)

    def find_by_id(self, key, id_):
        """Mencari objek berdasarkan ID di dalam list tertentu."""
        items = self.read(key)
        for it in items:
            if it.get("id") == id_:
                return it
        return None

    def update(self, key, id_, new_obj):
        """Memperbarui data objek berdasarkan ID di dalam list tertentu."""
        data = self._read_all()
        arr = data.get(key, [])
        for i, it in enumerate(arr):
            if it.get("id") == id_:
                arr[i] = new_obj
                break
        data[key] = arr
        self._write(data)

    def delete(self, key, id_):
        """Menghapus objek berdasarkan ID dari list tertentu di file JSON."""
        data = self._read_all()
        arr = data.get(key, [])
        arr = [it for it in arr if it.get("id") != id_]
        data[key] = arr
        self._write(data)
