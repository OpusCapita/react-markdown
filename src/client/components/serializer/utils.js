const Utils = {
    arrToStr(arr) {
        const mdArr = [];

        for (let token of arr) {
            mdArr.push('{\n');
            for (let key in token) {
                if (hasOwnProperty.call(token, key)) {
                    let val = typeof token[key] === 'string' || typeof token[key] === 'object' ? `'${token[key]}'` : token[key];
                    mdArr.push(`\t${key}: ${val},\n`);
                }
            }
            mdArr.push('},\n');
        }

        return mdArr.join('');
    }
};

export default Utils
