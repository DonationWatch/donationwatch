// These are required by the typedef but we don't need/use them so just default to empty
export const echartsEmptyLocale = {
  legend: {
    selector: {
      all: "",
      inverse: "",
    },
  },
  toolbox: {
    brush: {
      title: {
        rect: "",
        polygon: "",
        lineX: "",
        lineY: "",
        keep: "",
        clear: "",
      },
    },
    dataView: {
      title: "",
      lang: [],
    },
    dataZoom: {
      title: {
        zoom: "",
        back: "",
      },
    },
    magicType: {
      title: {
        line: "",
        bar: "",
        stack: "",
        tiled: "",
      },
    },
    restore: {
      title: "",
    },
    saveAsImage: {
      title: "",
      lang: [""],
    },
  },
  series: {
    typeNames: {
      pie: "",
      bar: "",
      line: "",
      scatter: "",
      effectScatter: "",
      radar: "",
      tree: "",
      treemap: "",
      boxplot: "",
      candlestick: "",
      k: "",
      heatmap: "",
      map: "",
      parallel: "",
      lines: "",
      graph: "",
      sankey: "",
      funnel: "",
      gauge: "",
      pictorialBar: "",
      themeRiver: "",
      sunburst: "",
      custom: "",
      chart: "",
    },
  },
  aria: {
    general: {
      withTitle: "",
      withoutTitle: "",
    },
    series: {
      single: {
        prefix: "",
        withName: "",
        withoutName: "",
      },
      multiple: {
        prefix: "",
        withName: "",
        withoutName: "",
        separator: {
          middle: "",
          end: "",
        },
      },
    },
    data: {
      allData: "",
      partialData: "",
      withName: "",
      withoutName: "",
      separator: {
        middle: "",
        end: "",
      },
    },
  },
};
