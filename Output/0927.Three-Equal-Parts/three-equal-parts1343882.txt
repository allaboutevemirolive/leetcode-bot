// https://leetcode.com/problems/three-equal-parts/solutions/1343882/rust-solution/
impl Solution {
    pub fn three_equal_parts(arr: Vec<i32>) -> Vec<i32> {
        let n = arr.len();
        let sum: i32 = arr.iter().sum();
        if sum == 0 {
            return vec![0, 2];
        }
        if sum % 3 != 0 {
            return vec![-1, -1];
        }

        let mut indice = vec![];
        let mut acc = 0;
        for i in 0..n {
            if arr[i] == 1 {
                acc += 1;
            }
            if acc == sum / 3 {
                indice.push(i);
                acc = 0;
            }
        }

        let zero_suffix_len = n - 1 - indice[2];
        let i = indice[0] + zero_suffix_len;
        let j = indice[1] + zero_suffix_len + 1;

        if let Some(fst) = arr
            .iter()
            .enumerate()
            .find(|(_, &a)| a == 1)
            .map(|(idx, _)| idx)
        {
            if let Some(snd) = arr[i + 1..]
                .iter()
                .enumerate()
                .find(|(_, &a)| a == 1)
                .map(|(idx, _)| idx + i + 1)
            {
                if let Some(trd) = arr[j..]
                    .iter()
                    .enumerate()
                    .find(|(_, &a)| a == 1)
                    .map(|(idx, _)| idx + j)
                {
                    if arr[fst..=i] == arr[snd..j] && arr[snd..j] == arr[trd..] {
                        return vec![i as i32, j as i32];
                    }
                }
            }
        }
        return vec![-1, -1];
    }
}