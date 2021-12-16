import bothArrow from '../../assets/images/components/both-arrow.png'
import colorImage from '../../assets/images/components/color-image.png'
import dash from '../../assets/images/components/dash.png'
import donut from '../../assets/images/components/donut.png'
import ellipse from '../../assets/images/components/ellipse.png'
import gifImage from '../../assets/images/components/gif-image.png'
import grayImage from '../../assets/images/components/gray-image.png'
import lineIcon from '../../assets/images/components/line.png'
import polygon from '../../assets/images/components/polygon.png'
import polyline from '../../assets/images/components/polyline.png'
import rect from '../../assets/images/components/rect.png'
import singleArrow from '../../assets/images/components/single-arrow.png'
import text from '../../assets/images/components/text.png'
import triangle from '../../assets/images/components/triangle.png'

const icon = `
<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 50 35" style="enable-background:new 0 0 50 35;" xml:space="preserve">
<style type="text/css">
	.st4{fill:{{strokeColor}};}
</style>
<g>
	<circle class="st4" cx="14.1" cy="17.5" r="2.8"/>
	<circle class="st4" cx="25" cy="17.5" r="2.8"/>
	<circle class="st4" cx="35.9" cy="17.5" r="2.8"/>
</g>
</svg>
`

export const etc = {
  name: 'etc',
  description: 'a group of various components',
  icon,
  templates: [
    {
      type: 'line',
      description: 'simple line',
      icon: lineIcon,
      group: 'line',
      model: {
        type: 'line',
        x1: 100,
        y1: 100,
        x2: 200,
        y2: 200,
        fillStyle: '#fff',
        strokeStyle: '#000',
        alpha: 1,
        hidden: false,
        lineWidth: 3,
        lineDash: 'solid',
        lineCap: 'butt'
      }
    },
    {
      type: 'dash',
      description: 'dash line',
      icon: dash,
      group: 'line',
      model: {
        type: 'line',
        x1: 100,
        y1: 100,
        x2: 200,
        y2: 200,
        fillStyle: '#fff',
        strokeStyle: '#000',
        alpha: 1,
        hidden: false,
        lineWidth: 3,
        lineDash: 'round-dot',
        lineCap: 'butt'
      }
    },
    {
      type: 'single arrow',
      description: 'single arrow tip line',
      icon: singleArrow,
      group: 'line',
      model: {
        type: 'line',
        x1: 100,
        y1: 100,
        x2: 200,
        y2: 200,
        fillStyle: '#fff',
        strokeStyle: '#000',
        alpha: 3,
        hidden: false,
        lineWidth: 3,
        lineDash: 'solid',
        begin: 'arrow',
        lineCap: 'butt'
      }
    },
    {
      type: 'both arrow',
      description: 'both arrow tip line',
      icon: bothArrow,
      group: 'line',
      model: {
        type: 'line',
        x1: 100,
        y1: 100,
        x2: 200,
        y2: 200,
        fillStyle: '#fff',
        strokeStyle: '#000',
        alpha: 1,
        hidden: false,
        lineWidth: 3,
        lineDash: 'solid',
        begin: 'arrow',
        end: 'arrow',
        lineCap: 'butt'
      }
    },
    {
      type: 'polyline',
      description: 'polyline',
      icon: polyline,
      group: 'line',
      model: {
        type: 'polyline',
        path: [
          { x: 100, y: 100 },
          { x: 200, y: 100 },
          { x: 200, y: 200 },
          { x: 100, y: 200 }
        ],
        fillStyle: '#fff',
        strokeStyle: '#000',
        alpha: 1,
        hidden: false,
        lineWidth: 1,
        lineDash: 'solid',
        lineCap: 'butt'
      }
    },
    {
      type: 'rect',
      description: 'rectangle shape',
      icon: rect,
      group: 'shape',
      model: {
        type: 'rect',
        left: 100,
        top: 100,
        width: 100,
        height: 100,
        fillStyle: '#fff',
        strokeStyle: '#000',
        alpha: 1,
        hidden: false,
        lineWidth: 1,
        lineDash: 'solid',
        lineCap: 'butt'
      }
    },
    {
      type: 'ellipse',
      description: 'ellipse shape',
      icon: ellipse,
      group: 'shape',
      model: {
        type: 'ellipse',
        rx: 50,
        ry: 50,
        cx: 150,
        cy: 150,
        fillStyle: '#fff',
        strokeStyle: '#000',
        alpha: 1,
        hidden: false,
        lineWidth: 1,
        lineDash: 'solid',
        lineCap: 'butt'
      }
    },
    {
      type: 'donut',
      description: 'donut shape',
      icon: donut,
      group: 'shape',
      model: {
        type: 'donut',
        rx: 50,
        ry: 50,
        cx: 150,
        cy: 150,
        ratio: 30,
        fillStyle: '#fff',
        strokeStyle: '#000',
        alpha: 1,
        hidden: false,
        lineWidth: 1,
        lineDash: 'solid',
        lineCap: 'butt'
      }
    },
    {
      type: 'triangle',
      description: 'triangle shape',
      icon: triangle,
      group: 'shape',
      model: {
        type: 'triangle',
        x1: 150,
        y1: 100,
        x2: 100,
        y2: 200,
        x3: 200,
        y3: 200,
        fillStyle: '#fff',
        strokeStyle: '#000',
        alpha: 1,
        hidden: false,
        lineWidth: 1,
        lineDash: 'solid',
        lineCap: 'butt'
      }
    },
    {
      type: 'polygon',
      description: 'polygon shape',
      icon: polygon,
      group: 'shape',
      model: {
        type: 'polygon',
        path: [
          { x: 100, y: 100 },
          { x: 200, y: 100 },
          { x: 200, y: 200 },
          { x: 100, y: 200 }
        ],
        fillStyle: '#fff',
        strokeStyle: '#000',
        alpha: 1,
        hidden: false,
        lineWidth: 1,
        lineDash: 'solid',
        lineCap: 'butt'
      }
    },
    {
      type: 'text',
      description: 'text',
      icon: text,
      group: 'textAndMedia',
      model: {
        type: 'text',
        left: 100,
        top: 100,
        width: 200,
        height: 50,
        text: 'Text',
        fillStyle: '#fff',
        strokeStyle: '#000',
        alpha: 1,
        hidden: false,
        lineWidth: 5,
        lineDash: 'solid',
        lineCap: 'butt',
        textAlign: 'left',
        textBaseline: 'top',
        textWrap: false,
        fontFamily: 'serif',
        fontSize: 30
      }
    },
    {
      type: 'color image',
      description: 'color image',
      icon: colorImage,
      group: 'textAndMedia',
      model: {
        type: 'image-view',
        left: 100,
        top: 100,
        width: 100,
        height: 100,
        isGray: false,
        fillStyle: '#fff',
        strokeStyle: '#000',
        alpha: 1,
        hidden: false,
        lineWidth: 1,
        lineDash: 'solid',
        lineCap: 'butt'
      }
    },
    {
      type: 'gray image',
      description: 'gray image',
      icon: grayImage,
      group: 'textAndMedia',
      model: {
        type: 'image-view',
        left: 100,
        top: 100,
        width: 100,
        height: 100,
        isGray: true,
        fillStyle: '#fff',
        strokeStyle: '#000',
        alpha: 1,
        hidden: false,
        lineWidth: 1,
        lineDash: 'solid',
        lineCap: 'butt'
      }
    },
    {
      type: 'gif image',
      description: 'gif image',
      icon: gifImage,
      group: 'textAndMedia',
      model: {
        type: 'gif-view',
        left: 100,
        top: 100,
        width: 100,
        height: 100
      }
    }
  ]
}
