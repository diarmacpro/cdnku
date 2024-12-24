    class albygo {
      constructor(a, b) {
        this.ably = new Ably.Realtime({ key: a, clientId: b });
        this.channels = {}; // Menyimpan channel dan event yang dilanggan
      }

      async rcv(a, b, c) {
        const d = this.ably.channels.get(a);
        if (!this.channels[a]) {
          this.channels[a] = { channel: d, events: {} };
        }

        // Subscribe hanya jika event belum dilanggan
        if (!this.channels[a].events[b]) {
          await d.subscribe(b, (m) => {
            if (c) c(m);
          });
          this.channels[a].events[b] = true;
        }

        if (c) c({ c: a, event: b });
      }

      async rcvOff(a, b, c) {
        const channelInfo = this.channels[a];
        if (channelInfo && channelInfo.events[b]) {
          // Unsubscribe dari event spesifik
          await channelInfo.channel.unsubscribe(b);
          delete channelInfo.events[b];

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
