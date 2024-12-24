class alby {
  constructor(a, b) {
    this.ably = new Ably.Realtime({ key: a, clientId: b });
    this.channels = {};
  }

  async rcv(a, b, c) {
    const d = this.ably.channels.get(a);
    if (!this.channels[a]) {
      await d.subscribe(b, (m) => {
        if (c) c(m);
      });
      this.channels[a] = d;
      if (c) c({"c":a});
    } else {;
      if (c) c({"c":a});
    }
  }

  async rcvOff(a, c) {
    const b = this.channels[a];
    if (b) {
      await b.unsubscribe();
      delete this.channels[a];
      if (c) c(null, a);
    } else {
      if (c) c('Error', a);
    }
  }

  // async rcvOffWdh(a, b, c) {
  //   const d = this.channels[a];
  //   if (d) {
  //     try {
  //       await d.unsubscribe(b);
  //       if (c) c(null, [b,a]);
  //     } catch (error) {
  //       if (c) c(error, [b,a]);
  //     }
  //   } else {
  //     if (c) c('Error', a);
  //   }
  // }

  async snd(a, b, d, c) {
    const channel = this.ably.channels.get(a);
    await channel.publish(b, d);
    if (c) c(null, [a,d]);
  }
}

const ws = new alby('Zs9P2Q.NpzJ6A:VmgYSBwlK54HfY5uK-6nJCPxHGjxvwMLvnuYOE7zURo', 'ably');
