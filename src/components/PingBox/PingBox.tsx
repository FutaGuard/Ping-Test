import {
  computed,
  DefineComponent,
  defineComponent,
  inject,
  onBeforeUnmount,
  onMounted,
  PropType,
  provide,
  Ref,
  ref,
  watch,
} from 'vue'
import usePing, { UsePingOptions } from '../../composables/usePing'
import styles from './style/index.module.scss'

export const PingBoxItem = defineComponent({
  name: 'PingBoxItem',
  props: {
    url: { type: String, required: true },
  },
  setup(props) {
    const pingOpts = inject<Ref<UsePingOptions>>('pingOpts', ref({}))
    const { ping, delta, error, loading, host, toggleAutoRefresh } = usePing(
      props.url,
      pingOpts.value,
    )

    watch(
      () => !!pingOpts.value.autoRefresh,
      (val) => toggleAutoRefresh(val),
      { immediate: true },
    )
    onBeforeUnmount(() => {
      toggleAutoRefresh(false)
    })

    onMounted(() => {
      ping()
    })

    const pingResult = computed(() => {
      return loading.value
        ? '🚚...'
        : error.value || delta.value == null
        ? '-'
        : `${delta.value}ms`
    })

    // styling
    function speedColor(ms: typeof delta.value) {
      let result: string
      if (ms == null) {
        result = ''
      } else if (ms < 0) {
        result = 'is-dark'
      } else if (ms <= 100) {
        result = 'is-primary'
      } else if (ms <= 200) {
        result = 'is-warning'
      } else {
        result = 'is-danger'
      }
      return result
    }

    const wrapperCls = computed(() => [
      'tile is-child notification p-4 title',
      speedColor(delta.value),
    ])
    const titleCls = [
      'column is-narrow-tablet is-12-mobile has-text-left-tablet',
      styles.pingItemTitle,
    ]
    const resultCls = computed(() => [
      'column',
      !error.value ? 'has-text-right-tablet' : 'has-text-centered',
      styles.pingItemResult,
    ])

    return {
      host,
      wrapperCls,
      pingResult,
      titleCls,
      resultCls,
    }
  },
  render() {
    return (
      <article class={this.wrapperCls}>
        <p class="columns is-mobile is-multiline title">
          <span class={this.titleCls}>{this.host}</span>
          <span class={this.resultCls}>{this.pingResult}</span>
        </p>
      </article>
    )
  },
})

const PingBox = defineComponent({
  Item: PingBoxItem,
  name: 'PingBox',
  props: {
    title: { type: String, default: '' },
    showAutoRefreshControl: { type: Boolean, default: false },
    pingOpts: { type: Object as PropType<UsePingOptions>, default: {} },
  },
  setup(props) {
    const opts = ref<UsePingOptions>(props.pingOpts ?? {})
    provide('pingOpts', opts)
    const handleChange = ({ target }: Event) => {
      opts.value.autoRefresh = !!(target as HTMLInputElement).checked
    }
    return {
      opts,
      handleChange,
    }
  },
  render() {
    return (
      <div class="box">
        {this.title && (
          <h1 class="has-text-black has-text-centered is-size-3">
            {this.title}
          </h1>
        )}
        {this.showAutoRefreshControl && (
          <div class="is-flex is-align-items-center is-justify-content-flex-end p-3">
            <input
              type="checkbox"
              name="autoRefresh"
              checked={this.opts.autoRefresh}
              onChange={this.handleChange}
            />
            <label for="autoRefresh" class="pl-2">
              自動更新
            </label>
          </div>
        )}
        <div class="tile">
          <div class="tile is-parent is-vertical">
            {this.$slots.default?.()}
          </div>
        </div>
      </div>
    )
  },
})

interface PingBox extends DefineComponent<typeof PingBox> {
  Item: typeof PingBoxItem
}
export default PingBox as PingBox
