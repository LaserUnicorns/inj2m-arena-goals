import { date as dateFilter } from '../filters/date.js'
import { number as numberFilter } from '../filters/number.js'
import { getResetStart, getResetEnd, RESET_DURATION, getSeasonStart } from '../arena.js'

Vue.component('app', {
    template: `
    <div>
        <form class="ui form">
            <div class="five fields">
                <div class="field">
                    <label>Per reset</label>
                    <input type="number" step="50000" v-model.lazy.number="perResetValue" />
                </div>
                <div class="field">
                    <label>Total</label>
                    <input type="number" v-model.lazy.number="totalValue" />                
                </div>
            </div>
        </form>

        <table class="ui celled unstackable table">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Sum</th>
                    <th>Start</th>
                    <th>End</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(row, index) in sums" v-bind:class="{ active: row.isCurrent }">
                    <td>{{ index + 1 }}</td>
                    <td>{{ row.sum | number({ useGrouping: true }) }}</td>
                    <td>{{ row.start | date('ddd D, MMM HH:mm') }}</td>
                    <td>{{ row.end | date('ddd D, MMM HH:mm') }}</td>
                </tr>
            </tbody>
        </table>
    </div>
    `,
    data() {
        return {
            goal: JSON.parse(localStorage.getItem('inj2m:goal')) || {
                type: 'per-reset',
                value: 1000000,
            },
            options: { resetCount: 14 },
            now: new Date(),
        }
    },
    computed: {
        totalValue: {
            get() {
                if (this.goal.type === 'total') {
                    return this.goal.value
                } else {
                    return this.goal.value * this.options.resetCount
                }
            },
            set(newVal) {
                this.goal.type = 'total'
                this.goal.value = newVal

                localStorage.setItem('inj2m:goal', JSON.stringify(this.goal))
            }
        },
        perResetValue: {
            get() {
                if (this.goal.type === 'per-reset') {
                    return this.goal.value
                } else {
                    const value = this.goal.value / this.options.resetCount
                    return Math.ceil(value)
                }
            },
            set(newVal) {
                this.goal.type = 'per-reset'
                this.goal.value = newVal

                localStorage.setItem('inj2m:goal', JSON.stringify(this.goal))
            }
        },
        sums() {
            const runningSums = []

            for (let index = 0; index < this.options.resetCount; index++) {
                if (index === 0) {
                    const start = getResetStart(getSeasonStart(this.now))
                    const end = getResetEnd(start)
                    const isCurrent = start < this.now && this.now < end

                    const sum = {
                        isCurrent,
                        sum: this.perResetValue,
                        start,
                        end,
                    }
                    runningSums.push(sum)
                } else {
                    const last = runningSums[runningSums.length - 1]
                    const start = new Date(last.start)
                    start.setHours(start.getHours() + RESET_DURATION)
                    const end = new Date(last.end)
                    end.setHours(end.getHours() + RESET_DURATION)
                    const isCurrent = start < this.now && this.now < end

                    const sum = {
                        isCurrent,
                        sum: last.sum + this.perResetValue,
                        start,
                        end,
                    }
                    runningSums.push(sum)
                }
            }

            return runningSums
        }
    },
    filters: {
        date: dateFilter,
        number: numberFilter
    }
})
