// https://leetcode.com/problems/permutation-sequence/solutions/2599469/rust-simple-solution-beats-100/
    pub fn get_permutation(n: i32, k: i32) -> String {
        let mut factorial = vec![1; n as usize + 1];
        for i in 1..=n as usize {
            factorial[i] = factorial[i - 1] * i;
        }
        // calculate kth permutation
        // divide k by factorial[n - 1] to get the first digit
        // subtract the first digit from k
        // repeat for the next digit
        let mut k = k - 1;
        let mut result = String::new();
        let mut nums = (1..=n).collect::<Vec<i32>>();
        for i in (1..=n as usize).rev() {
            let index = (k / factorial[i - 1] as i32) as usize;
            result.push_str(&nums[index].to_string());
            nums.remove(index);
            k -= index as i32 * factorial[i - 1] as i32;
        }
        return result
        
    }