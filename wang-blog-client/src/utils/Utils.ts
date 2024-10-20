import html2canvas from "html2canvas";
export class Utils {
    // 不输入参数调用的就是当前时间
    // 参数--需转换时间的时间戳
    static formatDate(time: string) {
        if (time === null) return '--'
        let date = new Date(parseInt(time));

        let YY = date.getFullYear();
        let MM = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
        let DD = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
        let hh = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
        let mm = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
        let ss = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();

        // 这里修改返回时间的格式
        return YY + "-" + MM + "-" + DD + " " + hh + ":" + mm + ":" + ss;
    }

    static exportImage(targetDom: any, title: string) {

        let copyDom = targetDom.cloneNode(true);
        copyDom.style.width = targetDom.scrollWidth + "px";
        copyDom.style.height = targetDom.scrollHeight + "px";
        let bodyDom: any = document.querySelector("body")
        bodyDom.appendChild(copyDom);

        html2canvas(copyDom, {
            useCORS: true,
            allowTaint: true,
            // onclone: (canvas) => {
            //     return new Promise((resolve: any, reject: any) => {
            //         setTimeout(() => {
            //             resolve()
            //         }, 2000)
            //     })
            // }
        }).then((canvas: any) => {
            let imgUrl = canvas.toDataURL("image/png");
            let a = document.createElement("a");
            a.download = `${title}_md.png`;// 设置下载的文件名，默认是'下载'
            a.href = imgUrl;

            a.click();
            a.remove(); // 下载之后把创建的元素删除
            bodyDom.removeChild(copyDom)
        })
    }

    static exportMd(content: string, title: string) {
        // 定义要导出的文本内容
        const text = content;

        // 创建Blob对象
        const blob = new Blob([text], { type: "text/plain" });

        // 创建URL对象
        const url = URL.createObjectURL(blob);

        // 创建a标签并设置href属性和download属性
        const a = document.createElement("a");
        a.href = url;
        a.download = `${title}.md`;
        a.click();
        a.remove()
    }
}