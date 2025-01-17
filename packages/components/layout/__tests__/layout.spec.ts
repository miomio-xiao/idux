import { mount } from '@vue/test-utils'
import { h } from 'vue'

import { renderWork } from '@tests'

import Layout from '../src/Layout'
import LayoutContent from '../src/LayoutContent'
import LayoutFooter from '../src/LayoutFooter'
import LayoutHeader from '../src/LayoutHeader'
import LayoutSider from '../src/LayoutSider'
import { LayoutProps } from '../src/types'

const defaultSlots = [
  h(LayoutHeader, null, { default: () => 'header' }),
  h(LayoutSider, null, { default: () => 'sider' }),
  h(LayoutContent, null, { default: () => 'content' }),
  h(LayoutFooter, null, { default: () => 'footer' }),
]

describe('Layout', () => {
  renderWork<LayoutProps>(Layout, {
    slots: {
      default: () => defaultSlots,
    },
  })

  describe('LayoutSider', () => {
    test('collapsed work', async () => {
      const wrapper = mount(Layout, {
        slots: {
          default: () => [h(LayoutSider, { collapsed: true }, { default: () => 'sider' })],
        },
      })

      expect(wrapper.find('.ix-layout-sider').classes()).toContain('ix-layout-sider-collapsed')
    })
  })
})
