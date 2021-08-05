import type { RowConfig } from '@idux/components/config'
import type { ComputedRef, CSSProperties } from 'vue'
import type { RowGutter, RowProps } from './types'
import type { BreakpointKey } from '@idux/cdk/breakpoint'

import { defineComponent, computed, provide } from 'vue'
import { BREAKPOINTS_KEYS, useScreens } from '@idux/cdk/breakpoint'
import { isObject, isArray, isUndefined, toNumber } from '@idux/cdk/utils'
import { useGlobalConfig } from '@idux/components/config'
import { rowToken } from './token'
import { rowProps } from './types'

export default defineComponent({
  name: 'IxRow',
  props: rowProps,
  setup(props, { slots }) {
    const config = useGlobalConfig('row')
    const classes = useClasses(props, config)

    const gutter = useGutter(props)
    const style = useStyle(gutter)

    provide(rowToken, { gutter })

    return () => (
      <div class={classes.value} style={style.value}>
        {slots.default?.()}
      </div>
    )
  },
})

function useClasses(props: RowProps, config: RowConfig) {
  return computed(() => {
    const row = 'ix-row'
    return {
      [row]: true,
      [`${row}-no-wrap`]: !(props.wrap ?? config.wrap),
      [`${row}-${props.justify}`]: props.justify,
      [`${row}-${props.align}`]: props.align,
    }
  })
}

function useGutter(props: RowProps) {
  const screens = useScreens()
  return computed(() => normalizeGutter(props.gutter, screens))
}

function useStyle(gutter: ComputedRef<[number, number]>) {
  return computed(() => {
    const style: CSSProperties = {}
    const [horizontalGutter, verticalGutter] = gutter.value
    if (horizontalGutter > 0) {
      style.marginLeft = `${horizontalGutter / -2}px`
      style.marginRight = style.marginLeft
    }
    if (verticalGutter > 0) {
      style.marginTop = `${verticalGutter / -2}px`
      style.marginBottom = style.marginTop
    }

    return style
  })
}

// gutter: RowGutter => [0, 0]
function normalizeGutter(propGutter: RowGutter, screens: Record<BreakpointKey, boolean>) {
  const results: [number, number] = [0, 0]

  const normalizedGutters = isArray(propGutter) ? propGutter : [propGutter, 0]
  normalizedGutters.forEach((gutter, index) => {
    if (isObject(gutter)) {
      BREAKPOINTS_KEYS.some(key => {
        if (!isUndefined(gutter[key]) && screens[key]) {
          results[index] = gutter[key]
          return true
        }
        return false
      })
    } else {
      results[index] = toNumber(gutter)
    }
  })
  return results
}