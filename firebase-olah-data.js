class Fbs {
    constructor(db) {
      this.db = db;
    }
  
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
  
    gDtOn(path, callback) {
      const dataRef = ref(this.db, path);
      onValue(dataRef, callback);
    }
  
    gDtOff(path) {
      const dataRef = ref(this.db, path);
      off(dataRef);
    }
}
  