class ablygo {
  constructor(a, b) {
    this.ably = new Ably.Realtime({ key: a, clientId: b });
    this.channels = {}; // Menyimpan channel dan event yang dilanggan
  }

  async rcv(a, b, c) {
    const d = this.ably.channels.get(a);
    if (!this.channels[a]) {
      this.channels[a] = { channel: d, events: {} };
    }

    // Jika b adalah false, subscribe ke semua event
    if (b === false) {
      // Tidak bisa memanggil semua event di channel secara langsung, jadi kita akan menggunakan wildcard
      const eventWildcard = '*';  // Sebagai contoh, menggunakan wildcard untuk semua event
      if (!this.channels[a].events[eventWildcard]) {
        await d.subscribe(eventWildcard, (m) => {
          if (c) c(m);
        });
        this.channels[a].events[eventWildcard] = true;
      }
    } else if (Array.isArray(b)) {
      // Jika b adalah array dari event names
      for (const event of b) {
        if (!this.channels[a].events[event]) {
          await d.subscribe(event, (m) => {
            if (c) c(m);
          });
          this.channels[a].events[event] = true;
        }
      }
    } else {
      // Jika b adalah single event name
      if (!this.channels[a].events[b]) {
        await d.subscribe(b, (m) => {
          if (c) c(m);
        });
        this.channels[a].events[b] = true;
      }
    }

    if (c) c({ c: a, event: Array.isArray(b) ? b : [b] });
  }

  async rcvOff(a, b, c) {
    const channelInfo = this.channels[a];
    if (channelInfo) {
      if (b === false || Array.isArray(b)) {
        // Jika b adalah array atau false, unsubscribe dari semua event
        if (b === false) {
          // Unsubscribe dari semua event yang dilanggan
          for (const event in channelInfo.events) {
            if (channelInfo.events.hasOwnProperty(event)) {
              await channelInfo.channel.unsubscribe(event);
            }
          }
          this.channels[a].events = {};  // Hapus semua event
        } else {
          // Unsubscribe dari event spesifik yang ada dalam array
          for (const event of b) {
            if (channelInfo.events[event]) {
              await channelInfo.channel.unsubscribe(event);
              delete channelInfo.events[event];
            }
          }
        }
      } else if (channelInfo.events[b]) {
        // Unsubscribe dari event spesifik
        await channelInfo.channel.unsubscribe(b);
        delete channelInfo.events[b];
      }

      // Jika tidak ada lagi event di channel, hapus channel
      if (Object.keys(channelInfo.events).length === 0) {
        delete this.channels[a];
      }

      if (c) c(null, { channel: a, event: b });
    } else {
      if (c) c("Error: Event not found", { channel: a, event: b });
    }
  }

  async snd(a, b, d, c) {
    const channel = this.ably.channels.get(a);
    await channel.publish(b, d);
    if (c) c(null, [a, b, d]);
  }
}
