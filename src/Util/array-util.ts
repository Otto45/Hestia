export class ArrayUtil {

    public static pushMany<T>(dest: Array<T>, src: Array<T>) {
        for (const item of src) {
            dest.push(item);
        }
    }

}
