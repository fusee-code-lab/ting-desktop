<template>
  <div
    class="enhanced-list"
    :style="{
      'padding-top': `${insets.top}px`,
      'padding-bottom': `${insets.bottom}px`,
      'padding-left': `${insets.left}px`,
      'padding-right': `${insets.right}px`,
    }"
    @scroll="onScroll"
  >
    <div
      class="enhanced-list-header"
      v-if="hasHeaderSlot"
      :class="{ fixed: fixedHeader }"
      :ref="headerDom"
    >
      <!-- @slot 列表头 -->
      <slot name="header"></slot>
    </div>
    <div
      class="enhanced-list-section"
      v-for="(item, index) in data"
      :key="index"
    >
      <!-- 
        @slot 分段头 
        @binding {Number} index of section
        @binding {Object} data of section header, typed EnhancedListSection's SectionData
      -->
      <div
        class="enhanced-list-section-header"
        :class="{ sticky: stickySectionHeader }"
        :style="{ top: `${headerHeight}px` }"
      >
        <slot name="section-header" :index="index" :section="item.data"> </slot>
      </div>
      <!-- 
        @slot 列表中的每一项
        @binding {Number} index of section
        @binding {Object} data of section, typed EnhancedListSection's ItemData
      -->
      <slot name="item" :index="index" :item="item.item"> </slot>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  PropType,
  reactive,
  ref,
  toRefs,
} from "vue";

export interface EdgesInsets {
  top: Number;
  left: Number;
  bottom: Number;
  right: Number;
}
const defaultEdgesInsts: EdgesInsets = { top: 0, left: 0, bottom: 0, right: 0 };

/**
 * EnhancedList 的每一段的数据模型
 */
export interface EnhancedListSection<
  SectionData = unknown,
  ItemData = unknown
> {
  data: SectionData;
  item: ItemData;
}

/**
 * 增强的列表，支持分段(Section)列表，段头(SectionHeader)吸附等特性.
 *
 * Note: 仅适用于纵向列表
 *
 * +--------------------+
 * |      header        |
 * |--------------------|
 * | +----------------+ |
 * | | section header | |
 * | |----------------| |
 * | |    item        | |
 * | +----------------+ |
 * |--------------------|
 * | +----------------+ |
 * | | section header | |
 * | |----------------| |
 * | |    item        | |
 * | +----------------+ |
 * +--------------------+
 */
export default defineComponent({
  name: "EnhancedList",
  props: {
    data: {
      type: Array as PropType<Array<EnhancedListSection>>,
      required: true,
      default: [],
    },
    /**
     * 列表四周的边距，其中 top 和 bottom 在用于控制内容距离列表边界的时候很有用
     */
    contentInsets: {
      type: Object as PropType<EdgesInsets>,
      required: false,
      default: defaultEdgesInsts,
    },
    /**
     * 是否固定列表头
     */
    fixedHeader: {
      type: Boolean,
      required: false,
      default: false,
    },
    /**
     * 是否自动吸附段头到顶部
     */
    stickySectionHeader: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  setup: (props, { slots }) => {
    const hasHeaderSlot = ref(!!slots.header);
    const edgesInsets = reactive<EdgesInsets>({
      ...defaultEdgesInsts,
      ...props.contentInsets,
    });

    const headerHeight = ref(0);
    const header = ref<HTMLElement | null>(null);
    const headerDom = (el: HTMLElement) => {
      header.value = el;
    };

    onMounted(() => {
      console.log("mounted", header.value.offsetHeight);
      headerHeight.value = header.value.offsetHeight;
    });

    function onScroll(event: Event) {
      console.log("嘿嘿", header.value.offsetHeight);
    }

    return {
      hasHeaderSlot,
      insets: edgesInsets,
      headerDom,
      onScroll,
      headerHeight,
    };
  },
});
</script>

<style lang="scss">
.enhanced-list {
  width: 100%;
  height: 100%;
  overflow: hidden;
  overflow-y: overlay;

  > .enhanced-list-header {
    z-index: 100;
  }

  > .enhanced-list-header.fixed {
    position: sticky;
    top: 0;
  }

  .enhanced-list-section-header {
    z-index: 50;
  }

  .enhanced-list-section-header.sticky {
    position: sticky;
    top: 0;
  }
}
</style>