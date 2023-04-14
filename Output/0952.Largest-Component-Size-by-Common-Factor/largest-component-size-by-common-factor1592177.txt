// https://leetcode.com/problems/largest-component-size-by-common-factor/solutions/1592177/rust-solution/
use std::cmp::max;
impl Solution {
    pub fn largest_component_size(nums: Vec<i32>) -> i32 {
        let mut par: Vec<i32> = vec![0; 100001];
        let mut rank: Vec<i32> = vec![0; 100001];
        let mut ans: i32 = 1;
        
        for i in 1..=100000{
            par[i] = i as i32;
        }
        
        for i in 0..nums.len() {
            rank[nums[i] as usize] = 1;
        }
        
        for i in 0..nums.len() {
            let mut j: usize = 2;
            while j*j <= nums[i] as usize  {
                if(nums[i] as usize % j == 0)
                {
                    Solution::union(j, nums[i] as usize, &mut par, &mut rank, &mut ans);
                    Solution::union(j, (nums[i] as usize/j), &mut par, &mut rank, &mut ans);
                }
                j+=1;
            }
        }
        return ans;
    }
    
    fn find(x: usize, par: &mut Vec<i32>) -> usize {
        return if par[x] == x as i32 {x} else {par[x] = Solution::find(par[x] as usize, par) as i32; return par[x] as usize};
    }
    
    fn union(a: usize, b: usize, par: &mut Vec<i32>, rank: &mut Vec<i32>, ans: &mut i32) {
        
        let a = Solution::find(a, par); 
        let b = Solution::find(b, par);
        
        if(a==b) {return;}
        
        if(rank[a]>=rank[b]){
            par[b]=a as i32; rank[a] += rank[b];
        }
        
        else {
            rank[b] += rank[a]; par[a]=b as i32;
        }
        *ans = max(*ans, max(rank[a],rank[b]));
    }
}