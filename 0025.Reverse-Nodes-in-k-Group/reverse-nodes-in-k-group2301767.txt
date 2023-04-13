// https://leetcode.com/problems/reverse-nodes-in-k-group/solutions/2301767/rust-concise-solution-using-vector/
impl Solution {
    pub fn reverse_k_group(head: Option<Box<ListNode>>, k: i32) -> Option<Box<ListNode>> {
        let mut head = head; 
        let mut ret = None;
        let mut tail = &mut ret;
        let mut data = vec![];
        
        while let Some(mut node) = head {
            head = node.next.take();
            node.next = None;
            data.push(node);
            
            if data.len() == k as usize {
                data.reverse();
                for p in data {
                    tail = &mut tail.insert(p).next;
                }
                data = vec![];
            }
        }
    
        if data.len() > 0 as usize {
            for p in data {
                tail = &mut tail.insert(p).next;
            }
        }
        
        ret
    }
}