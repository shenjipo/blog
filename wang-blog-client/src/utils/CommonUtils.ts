import { h, render } from 'vue'

export default class CommonUtils {
    static context: any
    static coms: Array<any> = []
    static InitUtils(context: any) {
        CommonUtils.context = context
    }
    static copy(val: any) {
        return JSON.parse(JSON.stringify(val))
    }

    static TsDialog(component: any, config: Record<string, any>) {
        const div = document.createElement('div');
        document.body.appendChild(div);
        component.appContext = CommonUtils.context

        const container = h(component, {
            ...config,
            hide: () => {
                const destroyDiv = CommonUtils.coms.pop()
                if (destroyDiv) {
                    document.body.removeChild(destroyDiv)
                }
                const dom = document.querySelector('.el-overlay')
                if (dom) {
                    document.body.removeChild(dom)
                }

            }
        })
        container.appContext = CommonUtils.context
        render(container, div)
        CommonUtils.coms.push(div)
    }
}