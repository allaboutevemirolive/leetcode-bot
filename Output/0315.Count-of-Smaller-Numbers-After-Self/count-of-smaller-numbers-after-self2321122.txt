// https://leetcode.com/problems/count-of-smaller-numbers-after-self/solutions/2321122/rust-with-fenwick-tree-idea/
impl Solution {
    pub fn count_smaller(nums: Vec<i32>) -> Vec<i32> {
        let (n, m) = (nums.len(), 32768);
        let (mut a, mut ans)=([0;32768], vec![0;n]);
        for (i, &y) in nums.iter().enumerate().rev() {
            let (mut x,mut su) = (y as isize + 19999, 0);
            while x>0  { su+=a[x as usize]; x-=-x&x; }
            let mut x = y as isize + 20000; ans[i]=su;
            while x<m  { a[x as usize]+=1; x+=-x&x; }
        }
        ans
    }
}