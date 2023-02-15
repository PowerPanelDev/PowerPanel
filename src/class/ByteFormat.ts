/**
 * 字节格式化
 */

function ByteFormat(v: number, r?: boolean) {
    if (v < 1024) return v + 'B';
    if ((v /= 1024) < 1024) return (r ? Math.round(v) : v.toFixed(2)) + 'KB';
    if ((v /= 1024) < 1024) return (r ? Math.round(v) : v.toFixed(2)) + 'MB';
    if ((v /= 1024) < 1024) return (r ? Math.round(v) : v.toFixed(2)) + 'GB';

    v /= 1024;
    return (r ? Math.round(v) : v.toFixed(2)) + 'TB';
}

export {ByteFormat};