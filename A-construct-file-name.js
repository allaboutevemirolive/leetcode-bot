const originalString = "https://leetcode.com/problems/median-of-two-sorted-arrays/solutions/3397130/rust-branchless/";

const pathSegments = originalString.split('/').filter(str => str !== "");
const problemName = pathSegments[pathSegments.indexOf("problems") + 1];
const solutionId = pathSegments[pathSegments.indexOf("solutions") + 1];

const reconstructedString = `${problemName}${solutionId}`;

console.log(reconstructedString); // median-of-two-sorted-arrays3397130
