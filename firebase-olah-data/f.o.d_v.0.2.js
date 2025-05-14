class Fbs {
  constructor(db) {
    this.db = db;
  }

  /**
   * Menyimpan data ke path tertentu. Jika value berupa array, setiap item akan disimpan ke path/index.
   * Jika value berupa object, akan disimpan langsung ke path yang ditentukan.
   *
   * @param {string} path - Path di dalam database tempat data akan disimpan.
   * @param {Object|Array} value - Data yang akan disimpan. Bisa berupa objek atau array.
   * @param {Function} [callback] - Fungsi yang akan dipanggil setelah proses penyimpanan selesai.
   *
   * @example
   * fbs.iDt('/users', { name: 'John Doe', status: 'active' }, () => {
   *   console.log('Data berhasil disimpan');
   * });
   */
  async iDt(path, value, callback) {
    const dataRef = ref(this.db, path);
    try {
      if (Array.isArray(value)) {
        const promises = value.map((item, index) => {
          const itemRef = ref(this.db, `${path}/${index}`);
          return set(itemRef, item);
        });
        await Promise.all(promises);
      } else if (typeof value === 'object') {
        await set(dataRef, value);
      }
      callback?.(null);
    } catch (error) {
      console.error('Gagal menyimpan data:', error);
      callback?.(error);
    }
  }

  /**
   * Menambahkan data dengan key unik pada path tertentu. Jika value berupa array, setiap item akan ditambahkan dengan key unik otomatis menggunakan push().
   * Jika value berupa object, akan ditambahkan sebagai node baru dengan key unik.
   *
   * @param {string} path - Path di dalam database tempat data akan ditambahkan.
   * @param {Object|Array} value - Data yang akan disimpan. Bisa berupa objek atau array.
   * @param {Function} [callback] - Fungsi yang akan dipanggil setelah data berhasil ditambahkan.
   *
   * @example
   * fbs.iDtKy('/users', { name: 'Jane Doe', status: 'inactive' }, () => {
   *   console.log('Data berhasil ditambahkan dengan key unik');
   * });
   */
  async iDtKy(path, value, callback) {
    const dataRef = ref(this.db, path);
    try {
      if (Array.isArray(value)) {
        const promises = value.map((item) => {
          const newItemRef = push(dataRef);
          return set(newItemRef, item);
        });
        await Promise.all(promises);
      } else if (typeof value === 'object') {
        const newItemRef = push(dataRef);
        await set(newItemRef, value);
      }
      callback?.(null);
    } catch (error) {
      console.error('Gagal menambahkan data:', error);
      callback?.(error);
    }
  }

  /**
   * Mengambil data dari path tertentu, dengan opsi filter berdasarkan field dan nilai tertentu.
   *
   * @param {string} path - Path data di database.
   * @param {Object|null} filters - Object berisi pasangan field dan nilai untuk filter (misal: { status: "active" }).
   * @param {Function} callback - Fungsi yang dipanggil dengan hasil data. Dipanggil dengan `null` jika data tidak ditemukan.
   *
   * @example
   * fbs.gDt('/users', { status: 'active' }, (data) => {
   *   console.log(data);
   * });
   */
  async gDt(path, filters = null, callback) {
    try {
      const dataRef = ref(this.db, path);
      let queryRef = dataRef;

      if (filters && typeof filters === 'object') {
        for (const [field, value] of Object.entries(filters)) {
          queryRef = query(queryRef, orderByChild(field), equalTo(value));
        }
      }

      const snapshot = await get(queryRef);
      callback?.(snapshot.exists() ? snapshot.val() : null);
    } catch (error) {
      console.error('Gagal mengambil data:', error);
      callback?.(null);
    }
  }

  /**
   * Memperbarui data di path tertentu, bisa dengan filter query atau langsung dengan objek data baru.
   *
   * @param {string} path - Path di mana data akan diperbarui.
   * @param {Object|null} filter - Object berisi field dan nilai untuk memfilter node yang akan diperbarui (misal: { id: "123" }).
   * @param {Object|Array} newData - Data baru yang akan ditulis ke database.
   * @param {Function} [callback] - Fungsi callback yang akan dipanggil setelah proses selesai. Dipanggil dengan error jika gagal.
   *
   * @example
   * fbs.upd('/users', { uid: 'abc123' }, { status: 'inactive' }, (err) => {
   *   if (err) console.error(err);
   *   else console.log('Berhasil update');
   * });
   */
  async upd(path, filter, newData, callback) {
    try {
      const dataRef = ref(this.db, path);
      let queryRef = dataRef;

      if (filter) {
        const [field, value] = Object.entries(filter)[0];
        queryRef = query(dataRef, orderByChild(field), equalTo(value));
      }

      if (Array.isArray(newData)) {
        const promises = newData.map((item, index) => {
          const itemRef = ref(this.db, `${path}/${index}`);
          return set(itemRef, item);
        });
        await Promise.all(promises);
      } else if (typeof newData === 'object') {
        await update(queryRef, newData);
      } else {
        await set(queryRef, newData);
      }
      callback?.(null);
    } catch (error) {
      console.error('Gagal memperbarui data:', error);
      callback?.(error);
    }
  }

  /**
   * Menghapus data jika tersedia di path.
   */
  async delDt(path, callback) {
    const dataRef = ref(this.db, path);
    try {
      const snapshot = await get(dataRef);
      if (snapshot.exists()) {
        await remove(dataRef);
        callback?.(null);
      } else {
        console.log('Data tidak ditemukan.');
        callback?.(null);
      }
    } catch (error) {
      console.error('Gagal menghapus data:', error);
      callback?.(error);
    }
  }

  /**
   * Mengaktifkan listener realtime.
   */
  gDtOn(path, callback) {
    const dataRef = ref(this.db, path);
    onValue(dataRef, callback);
  }

  /**
   * Menonaktifkan listener realtime.
   */
  gDtOff(path) {
    const dataRef = ref(this.db, path);
    off(dataRef);
  }
}
