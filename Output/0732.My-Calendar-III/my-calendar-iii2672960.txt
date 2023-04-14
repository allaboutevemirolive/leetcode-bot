// https://leetcode.com/problems/my-calendar-iii/solutions/2672960/rust-7-ms-fastest-100-two-pointers-partition-point-solution-with-detailed-comments/
struct MyCalendarThree
{
    // [1] two lists for start and end points that will be maintained sorted
    ss    : Vec<i32>,
    ee    : Vec<i32>,
    k_max : i32
}

impl MyCalendarThree 
{
    fn new() -> Self 
    {
        MyCalendarThree { ss : Vec::new(), ee : Vec::new(), k_max : 0 }
    }
    
    fn book(&mut self, s: i32, e: i32) -> i32 
    {
        let mut k_cur : i32 = 0;
        
        // [2] insert start and end points into corresponding lists while maintaining sort order
        let mut opened = self.ss.partition_point(|&x| x <= s);
        let mut closed = self.ee.partition_point(|&x| x <= s);
        let pos = self.ee.partition_point(|&x| x<= e);
        self.ss.insert(opened, s);
        self.ee.insert(pos, e);
                
        // [3] calculate the number 'k_cur' of intervals that remain open at point 's'
        k_cur = (opened - closed) as i32;
        self.k_max = self.k_max.max(k_cur);
        
        // [4] two-pointer iteration over start and end points to update the number   
        //     of intervals 'k_cur' that remain open at each iteration
        loop
        {
            // [5] no need to continue if:
            //     - either all starting points were accounted for
            //     - or next starting point lies to the righe of 'e'
            if opened >= self.ss.len() { break; }
            if self.ss[opened] >= e    { break; }
            
            if self.ss[opened] < self.ee[closed] { opened += 1; }
            else                                 { closed += 1; }
            
            k_cur = (opened - closed) as i32;
            self.k_max = self.k_max.max(k_cur);
        }
        
        return self.k_max;
    }
}