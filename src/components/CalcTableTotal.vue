<template>
    <a-table :columns="columns" :data-source="tableList" bordered defaultExpandAllRows>
        <template v-for="col in yearsColumn" :slot="col" slot-scope="text, record, index">
            <div class="rowtoTotal" v-if="record.type === 'total'" :key="col">
                {{ newNumeral(calRowTotal(col)) }}
            </div>
            <div v-else-if="isShow(record,col)" :key="`${col}-else`">
                <a-input v-if="record.isLeaf" style="margin: -5px 0" :value="text" type="number"
                    @change="e => onCellChange(record.key,col, record,e.target.value)" />
                <span v-else>{{newNumeral(text)  }}</span>
            </div>
        </template>
        <template slot="total" slot-scope="text, record">
            <div class v-if="record.type==='total'">
                {{ newNumeral(calTotalTotal(record)) }}
            </div>
            <div class v-else>
                {{ newNumeral(calTotal(record)) }}
            </div>
        </template>
    </a-table>
</template>
<script>
/* 
父元素不可编辑
*/
/**
 * 处理非法数字,转换为0
 */
function preParam(num) {
    if (num === '' || num === undefined || num === null) {
        return 0;
    }
    return num;
}
/**
 * 当前值+偏差
 */
function newVal(current, deviation) {
    return preParam(current) + preParam(deviation);
}
/**
 *
 */
function findNodes(parentKey, keyString, tableList) {
    const nodes = [];
    if (keyString !== '') {
        const keys = keyString.split('-');
        let newKey = keys.shift();
        if (parentKey !== '') {
            newKey = `${parentKey}-${newKey}`;
        }
        const parentNode = tableList.find(node => node.key === newKey);
        if (parentNode) {
            nodes.push(parentNode);
        }
        if (parentNode && parentNode.children !== undefined) {
            findNodes(newKey, keys.join('-'), parentNode.children).forEach((node) => {
                nodes.push(node);
            });
        }
    }
    return nodes;
}

let columns = [
    {
        title: '名称',
        dataIndex: 'title',
        width: '25%',
        scopedSlots: { customRender: 'name' },
    },

];
const yearList = [2020, 2021, 2022, 2023]
let  yearsColumn = []
yearList.forEach(year => {
    const item = {
        title: year,
        dataIndex: `year${year}`,
        width: '15%',
        align: 'right',
        scopedSlots: { customRender: `year${year}` }
    }
    yearsColumn.push(`year${year}`)
    columns.push(item)
})
columns.push({
    title: '合计',
    key: 'total',
    scopedSlots: { customRender: 'total' },
    width: 100,
    align: 'right',
},)
const tableList = [
    {
        title: '0',
        key: '0',
        isLeaf: false, 

        children: [
            {
                title: '0-0',
                key: '0-0',
                isLeaf: false, 
                children: [
                    { title: '0-0-0', key: '0-0-0', year2020: 0, year2021: 0, year2022: 0, year2023: 0, isLeaf: true },
                    { title: '0-0-1', key: '0-0-1', year2020: 0, year2021: 0, year2022: 0, isLeaf: true },
                    { title: '0-0-2', key: '0-0-2', year2020: 0, year2021: 0, year2022: 0, type: 'other', isLeaf: true },
                ],
            },
            {
                title: '0-1',
                key: '0-1',
                isLeaf: false, 

                children: [
                    { title: '0-1-0', key: '0-1-0', year2020: 0, year2021: 0, year2022: 0, isLeaf: true },
                    { title: '0-1-1', key: '0-1-1', year2020: 0, year2021: 0, year2022: 0, isLeaf: true },
                    { title: '0-1-2', key: '0-1-2', year2020: 0, year2021: 0, year2022: 0, year2023: 0, isLeaf: true },
                ],
            },
        ],
    },
    {
        title: '1',
        key: '1',
        isLeaf: false, 

        children: [
            {
                title: '1-0',
                key: '1-0',
                isLeaf: false, 
                children: [
                    { title: '1-0-0', key: '1-0-0', year2020: 0, year2021: 0, year2022: 0, year2023: 0, isLeaf: true },
                    { title: '1-0-1', key: '1-0-1', year2020: 0, year2021: 0, year2022: 0, year2023: 0, isLeaf: true },
                    { title: '1-0-2', key: '1-0-2', year2020: 0, year2021: 0, isLeaf: true },
                ],
            },],

    },
    {
        id: '9999',
        type: 'total',
        title: '合计',
        isLeaf: false, 

    }
];
import cloneDeep from "lodash/cloneDeep";
import numeral from 'numeral';

const newNumeral = text => (text === 0 || text === undefined ? 0 : numeral(text).format('0,0'));

export default {
    data() {
        this.cacheData = tableList.map(item => ({ ...item }));
        return {
            yearsColumn,
            yearList,
            tableList,
            columns,
            editingKey: '',
        };
    },

    methods: {
        newNumeral,
        calTotal(record) {
            let total = 0;
            Object.keys(record)
                .filter(name => name.startsWith('year'))
                .forEach((key) => {
                    total += parseFloat(preParam(record[key]), 10);
                });
            return total;
        },
        calTotalTotal(record) {
            let total = 0;
                yearsColumn.forEach((items) => {
                    total += parseFloat(preParam(record[items]), 10);
                });
            return total;
        },
        calRowTotal(dataIndex) {
            const newData = cloneDeep(this.tableList);
            const length = newData.length - 1;
            const lastdata = newData[length];
            const dataSource = this.tableList.slice(0,length);
            let total = 0;
            dataSource.forEach((item) => {
                total += parseFloat(preParam(item[dataIndex]), 10);
                lastdata[dataIndex] = total;
            });
            return total;
        },
        onCellChange(key, dataIndex, record, value) {
            const dataSource = [...this.tableList];
            if (value === '') {
                alert('不可为空')
            }
             else {
            const preVal = record[dataIndex];
            const cha = preParam(value) - preParam(preVal);
            // 返回数组形式
            findNodes('', key, dataSource).forEach((node) => {
                console.log(node);
                    node[dataIndex] = newVal(preParam(node[dataIndex]), cha);
            });
            const length = dataSource.length - 1;
            const lastdata = dataSource[length];
                lastdata[dataIndex] = newVal(preParam(lastdata[dataIndex]), cha);
            this.tableList = [...dataSource];
            }
        },
        isShow(row,col){
            console.log(row)
            return row[col]!==undefined
        }
    },
};
</script>
<style scoped>
.editable-row-operations a {
    margin-right: 8px;
}
</style>
  