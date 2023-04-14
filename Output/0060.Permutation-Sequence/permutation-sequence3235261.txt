// https://leetcode.com/problems/permutation-sequence/solutions/3235261/rust-o-2-n/
impl Solution {
    pub fn get_permutation(n: i32, mut k: i32) -> String {
        let mut f = 1;
        let mut nums = vec![];
        for i in 1..=n {
            f = f*i;
            nums.push((b'0'+i as u8) as char);
        }

        k -= 1;
        let mut res = vec![];
        for i in (1..=n).rev() {
            f = f / i;
            let pos = (k / f) as usize;
            let rem = k % f;
            k = rem;
            res.push(nums[pos]);
            nums.remove(pos);
            //println!("{} {:?}", pos, nums);
        }
        return res.into_iter().collect();
    }
}