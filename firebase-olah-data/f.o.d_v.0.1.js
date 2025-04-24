class Fbs {
 constructor(db) {
   // Inisialisasi dengan instance database Firebase
   this.db = db;
 }

 /**
  * Menyimpan data ke path tertentu. Jika value berupa array, setiap item akan ditulis ke path/index.
  * @param {string} path - Path di dalam database tempat data akan ditulis.
  * @param {Object|Array} value - Data yang akan disimpan. Bisa berupa object atau array.
  * @param {Function} [callback] - Fungsi yang akan dipanggil setelah penyimpanan selesai.
  */
 iDt(path, value, callback) {
   const dataRef = ref(this.db, path);
   if (Array.isArray(value)) {
     value.forEach((item, index) => {
       const itemRef = ref(this.db, `${path}/${index}`);
       set(itemRef, item);
     });
   } else if (typeof value === 'object') {
     set(dataRef, value);
   }
   if (callback) callback();
 }

 /**
  * Menambahkan data ke path menggunakan push() agar mendapat key unik secara otomatis.
  * @param {string} path - Path di dalam database tempat data akan ditambahkan.
  * @param {Object|Array} value - Data yang akan disimpan. Bisa berupa object atau array.
  * @param {Function} [callback] - Fungsi yang akan dipanggil setelah penyimpanan selesai.
  */
 iDtKy(path, value, callback) {
   const dataRef = ref(this.db, path);
   if (Array.isArray(value)) {
     value.forEach((item) => {
       const newItemRef = push(dataRef);
       set(newItemRef, item);
     });
   } else if (typeof value === 'object') {
     const newItemRef = push(dataRef);
     set(newItemRef, value);
   }
   if (callback) callback();
 }

 /**
  * Mengambil data dari path tertentu, dengan opsi filter berdasarkan field dan nilai tertentu.
  * @param {string} path - Path data di database.
  * @param {Object|null} filters - Object berisi pasangan field dan nilai untuk filter (e.g., { status: "active" }).
  * @param {Function} callback - Fungsi yang dipanggil dengan hasil data (null jika tidak ada).
  */
 gDt(path, filters = null, callback) {
   const dataRef = ref(this.db, path);
   let queryRef = dataRef;

   if (filters && typeof filters === 'object') {
     for (const [field, value] of Object.entries(filters)) {
       queryRef = query(queryRef, orderByChild(field), equalTo(value));
     }
   }

   get(queryRef)
     .then((snapshot) => {
       if (snapshot.exists()) {
         callback?.(snapshot.val());
       } else {
         callback?.(null);
       }
     })
     .catch((error) => {
       console.error('Gagal mengambil data:', error);
     });
 }

 /**
  * Memperbarui data di path tertentu, bisa dengan filter query atau langsung dengan objek data baru.
  * @param {string} path - Path di mana data akan diperbarui.
  * @param {Object|null} filter - Object berisi field dan nilai untuk memfilter node yang akan diperbarui.
  * @param {Object|Array} newData - Data baru yang akan ditulis.
  * @param {Function} [callback] - Fungsi callback setelah proses selesai.
  */
 upd(path, filter, newData, callback) {
   const dataRef = ref(this.db, path);
   let queryRef = dataRef;

   if (filter) {
     const field = Object.keys(filter)[0];
     const value = filter[field];
     queryRef = query(dataRef, orderByChild(field), equalTo(value));
   }

   if (Array.isArray(newData)) {
     newData.forEach((item, index) => {
       const itemRef = ref(this.db, `${path}/${index}`);
       set(itemRef, item);
     });
   } else if (typeof newData === 'object') {
     update(queryRef, newData)
       .then(() => {
         console.log('Data berhasil diperbarui');
         callback?.();
       })
       .catch((error) => {
         console.error('Gagal memperbarui data:', error);
       });
   } else {
     set(queryRef, newData)
       .then(() => {
         console.log('Data berhasil diperbarui');
         callback?.();
       })
       .catch((error) => {
         console.error('Gagal memperbarui data:', error);
       });
   }
 }

 /**
  * Menghapus data pada path tertentu jika data tersebut ada.
  * @param {string} path - Path data yang ingin dihapus.
  * @param {Function} [callback] - Fungsi yang dipanggil setelah data dihapus (atau tidak ditemukan).
  */
 delDt(path, callback) {
   const dataRef = ref(this.db, path);

   get(dataRef)
     .then((snapshot) => {
       if (snapshot.exists()) {
         remove(dataRef)
           .then(() => callback?.())
           .catch((error) => console.error('Gagal menghapus data:', error));
       } else {
         console.log('Data tidak ditemukan, penghapusan dibatalkan.');
         callback?.();
       }
     })
     .catch((error) => console.error('Gagal memeriksa data:', error));
 }

 /**
  * Mengaktifkan listener realtime untuk perubahan data di path tertentu.
  * @param {string} path - Path data yang ingin dipantau.
  * @param {Function} callback - Fungsi callback yang akan dipanggil setiap kali data berubah.
  */
 gDtOn(path, callback) {
   const dataRef = ref(this.db, path);
   onValue(dataRef, callback);
 }

 /**
  * Menonaktifkan listener realtime pada path tertentu.
  * @param {string} path - Path data yang ingin dihentikan pemantauannya.
  */
 gDtOff(path) {
   const dataRef = ref(this.db, path);
   off(dataRef);
 }
}
