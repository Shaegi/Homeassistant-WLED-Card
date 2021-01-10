import { mdiLamp, mdiDeskLamp, mdiFloorLamp, mdiCoachLamp, mdiOutdoorLamp, mdiLavaLamp} from '@mdi/js'

const onFill = 'fill="#FFEF00"'
const offFill = ' fill="#2c3e50"'

const getSvgString = (path, isOn) => {
    return `
    <svg viewBox="0 0 24 24">
        <path d="${path}" ${isOn ? onFill : offFill} />
    </svg>
    ` 
}
// on: `<svg id="lamp123" style="height: 10vh" viewBox="0 0 24 24">
//   <path ${onFill} d="M8,2H16L20,14H4L8,2M11,15H13V20H18V22H6V20H11V15Z" />
// </svg>`,
// off: `<svg id="lamp123" style="height: 10vh" viewBox="0 0 24 24">
//   <path  ${offFill} d="M8,2H16L20,14H4L8,2M11,15H13V20H18V22H6V20H11V15Z" />
// </svg>`

const iconMap = {
    lamp: mdiLamp,
    deskLamp: mdiDeskLamp,
    coachLamp: mdiCoachLamp,
    outdoorLamp: mdiOutdoorLamp,
    lavaLamp: mdiOutdoorLamp,
    floorLamp: mdiFloorLamp
}

const icons = Object.keys(iconMap).reduce((acc, curr) => {
    acc[curr] = {
        on: getSvgPath(iconMap[curr], true),
        off: getSvgPath(iconMap[curr], false)
    }
    return acc
}, {})
export default icons