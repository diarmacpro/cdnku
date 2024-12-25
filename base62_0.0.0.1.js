class base62 {
    constructor() {
        this.C = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        this.B = 62;
    }

    d(n) {
        if (n < 0) return null;
        if (n === 0) return this.C[0];

        let r = "";
        while (n > 0) {
            const m = n % this.B;
            r = this.C[m] + r;
            n = Math.floor(n / this.B);
        }
        return r;
    }

    e(s) {
        if (!s || typeof s !== "string") return null;

        let r = 0;
        for (let i = 0; i < s.length; i++) {
            const v = this.C.indexOf(s[i]);
            if (v === -1) return null;
            r = r * this.B + v;
        }
        return r;
    }
}
