const DataPath = {
    Parse(raw: string) {
        const r = [];
        const paths = JSON.parse(raw);
        for (const key in paths) {
            r.push({
                key: key,
                value: paths[key]
            });
        }
        return r;
    },
    Build(v: Array<{ key: string, value: string }>) {
        const paths = {};
        v.map((v) => (paths as any)[v.key] = v.value);
        return JSON.stringify(paths);
    }
}

export {DataPath};