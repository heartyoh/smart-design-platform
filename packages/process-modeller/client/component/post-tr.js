const icon = `
<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 50 35" style="enable-background:new 0 0 50 35;" xml:space="preserve">
<style type="text/css">
	.stroke{fill:none;stroke:{{strokeColor}};stroke-miterlimit:10;}
	.stroke-inside{fill:none;stroke:{{strokeColor}};stroke-width:0.75;stroke-miterlimit:10;}
	.stroke-inside-dash{fill:none;stroke:{{strokeColor}};stroke-width:0.75;stroke-miterlimit:10;stroke-dasharray:0.9865,0.9865;}
	.stroke-inside-thin{fill:{{strokeColor}};stroke:{{strokeColor}};stroke-width:0.5;stroke-miterlimit:10;}
</style>
<g>
	<path class="stroke" d="M41.7,29.8v-3.2h2.2c1.6,0,3-1.3,3-3v-13c0-1.6-1.4-3-3-3H14.4V4.2"/>
	<path class="stroke" d="M8.1,4.2v3.4h-2c-1.6,0-3,1.4-3,3v13c0,1.7,1.4,3,3,3h29.3v3.2"/>
		<polygon class="stroke-inside-thin" points="13.8,2.1 8.5,2.1 11.1,4.1 13.8,2.1 		"/>
		<polygon class="stroke-inside-thin" points="41.3,30.9 36,30.9 38.6,32.9 41.3,30.9 		"/>
		<path class="stroke-inside" d="M24.7,11.9v10.6c0,0,1.7,3,3.5,0V12.2c0,0,1.6-3.5,3.6,0v10.4c0,0,1.5,2.7,3.3,0V12.2l0.1-0.4
			c0,0,1.5-3.5,3.5,0v19.3"/>
				<line class="stroke-inside" x1="11.1" y1="4.7" x2="11.1" y2="5.2"/>
				<path class="stroke-inside-dash" d="M11.1,6.1v16.3c0,0,1.7,3,3.5,0V12.2c0,0,1.6-3.5,3.6,0v10.4c0,0,1.5,2.7,3.3,0V12.2l0-0.3
					c0,0,1.3-1.9,2.6-0.8"/>
				<path class="stroke-inside" d="M24.5,11.4c0.1,0.1,0.2,0.3,0.3,0.4"/>
</g>
</svg>
`

export const postTr = {
  name: 'post-tr',
  description: 'a group of various post treatment',
  icon,
  templates: []
}
