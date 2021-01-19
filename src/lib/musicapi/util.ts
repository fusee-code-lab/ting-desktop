export function lyric_decode(str: string, needTranslate = false) {
    if (!str) {
        return needTranslate ? {
            lyric: [],
            translate: []
        } : []
    }
    let list = str.replace(/\<\d+\>/g, '').split('\n')
    const lyric_arr: {}[] = []
    let translate_lyric_arr: {}[] = []
    list.forEach((item, index) => {
        const matchs = item.match(/((\[\d+:\d+\.\d+\])+)(.*)/)
        if (matchs && matchs[1]) {
            const t_array = matchs[1].match(/\[\d+:\d+\.\d+\]/g)
            t_array.forEach(item => {
                lyric_arr.push([
                    item.substring(1, item.length - 1),
                    matchs[3]
                ])
                if (needTranslate && list[index + 1]) {
                    const translateMatchs = list[index + 1].match(/(\[x\-trans\])(.*)/)
                    if (translateMatchs && translateMatchs[2]) {
                        translate_lyric_arr.push([
                            item.substring(1, item.length - 1),
                            translateMatchs[2]
                        ])
                    } else {
                        translate_lyric_arr.push([
                            item.substring(1, item.length - 1),
                            ''
                        ])
                    }
                } else {
                    translate_lyric_arr.push([
                        item.substring(1, item.length - 1),
                        ''
                    ])
                }
            })
        }
    })
    if (needTranslate && translate_lyric_arr.filter((item: any) => item[1]).length === 0) {
        translate_lyric_arr = []
    }
    return needTranslate ? {
        lyric: lyric_arr.sort(),
        translate: translate_lyric_arr.sort()
    } : lyric_arr.sort()
}

export const noSongsDetailMsg = '无法获取信息，请检查songId'
