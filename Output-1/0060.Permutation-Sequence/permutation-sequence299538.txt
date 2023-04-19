// https://leetcode.com/problems/permutation-sequence/solutions/299538/rust-solution-based-on-next-permutation-31/
impl Solution {
    fn next_permutation(nums: &mut Vec<i32>) {
        let mut i = nums.len() - 1;
        while i > 0 {
            i -= 1;
            if nums[i] < nums[i + 1] {
                let mut j = nums.len() - 1;
                while nums[i] >= nums[j] {
                    j -= 1;
                }
                nums.swap(i, j);
                                               
                let mut low = i + 1;
                let mut high = nums.len() - 1;
                                               
                while low < high {
                    nums.swap(low, high);  
                    low += 1;           
                    high -= 1;
                }                              
                return;                 
            }
        }                                      
        nums.sort()                            
    }

    
    pub fn get_permutation(n: i32, k: i32) -> String {
        let mut payload = (1..=n).collect();
        for _ in 0..k-1 {
            Self::next_permutation(&mut payload);
        }
        payload.iter().map(|a| a.to_string()).collect::<String>()
    }
}