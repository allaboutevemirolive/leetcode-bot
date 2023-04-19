// https://leetcode.com/problems/maximal-rectangle/solutions/3244931/rust-dp-short-solution/
impl Solution {
    pub fn maximal_rectangle(matrix: Vec<Vec<char>>) -> i32 {
        let n = matrix.len();
        let m = matrix[0].len();
        let mut ans = 0;

        let mut hist = vec![vec![]; m];
        for i in (0..n).rev() {
            let mut stack = vec![];
            for j in 0..m {
                let height = if matrix[i][j] == '1' {
                    hist[j].last().unwrap_or(&0) + 1
                } else {
                    0
                };
                hist[j].push(height);
            }

            let mut heights = vec![0; m];
            for j in 0..m {
                heights[j] = *hist[j].last().unwrap();
            }

            for right in 0..=hist.len() {
                while !stack.is_empty()
                    && (right == hist.len() || heights[*stack.last().unwrap()] >= heights[right])
                {
                    let mid = stack.pop().unwrap();
                    let h = heights[mid];
                    let left = stack.last().map(|x| *x as i32).unwrap_or(-1);
                    let square = h * (right as i32 - left - 1);
                    ans = ans.max(square);
                }
                stack.push(right);
            }
        }
        ans        
    }
}