export const parsedDataFunc = (data: any) => {
  let maxRows = 0;
  data?.forEach((row: Array<number | string>) => {
    if (maxRows < row.length) {
      maxRows = row.length;
    }
  })
  const prepared = data?.map((row: (number | string)[]) => {
    if(row.length < maxRows) {
      row = [...row, ...Array.from(Array(maxRows - row.length).keys()).map(el => '')]
    }
    return row
  }) || [];
  prepared.map((row: any) => Object.assign({}, row))
  return [...prepared];
}
