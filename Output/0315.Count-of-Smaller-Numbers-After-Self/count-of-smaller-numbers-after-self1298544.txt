// https://leetcode.com/problems/count-of-smaller-numbers-after-self/solutions/1298544/rust-binary-indexed-tree-solution/
struct BinaryIndexedTree {
    n: i32,
    v: Vec<i32>,
}

impl BinaryIndexedTree {
    fn new(n: i32) -> Self {
        Self {
            n,
            v: vec![0; n as usize + 1],
        }
    }
    fn add(&mut self, i: i32) {
        let mut x = i;
        while x <= self.n {
            self.v[x as usize] += 1;
            x += 1 << x.trailing_zeros();
        }
    }
    fn sum(&self, i: i32) -> i32 {
        let mut ret = 0;
        let mut x = i;
        while x > 0 {
            ret += self.v[x as usize];
            x -= 1 << x.trailing_zeros();
        }
        ret
    }
}

const BASE: i32 = 10_000;

impl Solution {
    pub fn count_smaller(nums: Vec<i32>) -> Vec<i32> {
        let mut bit = BinaryIndexedTree::new(BASE * 2 + 1);
        let mut answer = vec![0; nums.len()];
        for (i, &num) in nums.iter().enumerate().rev() {
            answer[i] = bit.sum(BASE + num);
            bit.add(BASE + num + 1);
        }
        answer
    }
}