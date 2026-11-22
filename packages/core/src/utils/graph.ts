// We need to prefix the names to avoid duplicate graph node ids error in echarts
export const sourceId = (string: string) => `s${string}`;

export const targetId = (string: string) => `t${string}`;
