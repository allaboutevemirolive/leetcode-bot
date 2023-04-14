// https://leetcode.com/problems/three-equal-parts/solutions/1354250/rust-o-n-solution/
impl Solution {
    pub fn three_equal_parts(arr: Vec<i32>) -> Vec<i32> {
        let mut idxs = vec![];
        for i in 0..arr.len() {
            if arr[i] == 1 {
                idxs.push(i);
            }
        }
        
        let n = idxs.len();
        if n == 0 {
            return vec![0,arr.len() as i32-1];
        }
        // number of 1s should be divisible by 3
        if n % 3 != 0 {
            return vec![-1, -1];
        }
        // find starting indices for each part
        let (s0, s1, s2) = (0, n/3, 2*n/3);
        // equal gaps between 1's
        let (mut i, mut j, mut k) = (s0+1, s1+1, s2+1);
        while i < s1 {
            let g0 = idxs[i] - idxs[i-1];
            let g1 = idxs[j] - idxs[j-1];
            let g2 = idxs[k] - idxs[k-1];
            if g0 != g1 || g1 != g2 {
                return vec![-1, -1];
            }
            i += 1;
            j += 1;
            k += 1;
        }
        // equal trailing 0's
        let N = arr.len() - 1;
        let trailing_0 = N - idxs[n-1];
        if idxs[s1] - idxs[s1-1] <= trailing_0 || idxs[s2] - idxs[s2-1] <= trailing_0 {
            return vec![-1, -1];
        }
        // println!("{} {} {}", idxs[s1], idxs[s2], trailing_0);
        vec![
            (idxs[s1-1]+trailing_0) as i32,
            (idxs[s2-1]+trailing_0+1) as i32,
        ]
    }
}