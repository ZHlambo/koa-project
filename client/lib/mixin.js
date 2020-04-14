export default {
	methods: {
		toF(a) {
			return a ? a.toFixed(2) : ''
		}
	},
	filters: {
		toF(a) {
			console.log(a);
			return a ? a.toFixed(2) : ''
		}
	}
}