import { defineComponent } from 'vue'
import { PingBox } from './components'
import settings from './config/defaultSettings'

export default defineComponent({
  name: 'App',
  setup() {
    const pingUrls = settings.pingUrls
    const boxPops = {
      title: settings.pingBoxTitle,
      pingOpts: {
        autoRefresh: settings.autoRefresh,
        refreshInterval: settings.refreshInterval,
        timeout: settings.timeout,
        multiplier: settings.pingMultiplier,
        debug: settings.debug,
      },
      showAutoRefreshControl: settings.showAutoRefreshControl,
    }

    return () => (
      <PingBox {...boxPops}>
        {() => pingUrls.map((url) => <PingBox.Item url={url} key={url} />)}
      </PingBox>
    )
  },
})
