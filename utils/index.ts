export function calculateTruePercentage(boolArray: boolean[]) {
	const trueCount = boolArray.filter(Boolean).length; // Count of true values
	const totalCount = boolArray.length; // Total number of elements
	const percentage = (trueCount / totalCount) * 100; // Calculate percentage
	return percentage;
}
