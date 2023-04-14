// https://leetcode.com/problems/largest-rectangle-in-histogram/solutions/3340974/rust-solution/
impl Solution
{
    pub fn largest_rectangle_area(heights: Vec<i32>) -> i32
    {
        let mut vec = Vec::<i32>::from([-1]);
        let mut ans = 0;

        for i in 0..heights.len()
        {
            while
                vec.len() != 1
                        && heights[*vec.last().unwrap() as usize] >= heights[i]
            {
                ans = ans.max(heights[vec.pop().unwrap() as usize]
                              * ((i as i32) - vec.last().unwrap() - 1))
            }

            vec.push(i as i32);
        }

        while vec.len() != 1
        {
            ans = ans.max( heights[vec.pop().unwrap() as usize]
                          * (heights.len() as i32 - vec.last().unwrap() - 1) );
        }
        
        ans
    }
}