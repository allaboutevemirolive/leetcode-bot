// https://leetcode.com/problems/sliding-window-maximum/solutions/155530/very-simple-java-solution-beats-100/
class Solution {
    public int[] maxSlidingWindow(int[] nums, int k) {
        if(nums.length == 0 || nums.length < k)
            return new int[]{};
        int N = nums.length;
        // use p to record the index of the max num in last window
        int p = -1;
        int[] res = new int[N - k + 1];
        for(int i = 0; i < N-k+1; i++){
            // p is in the current window, only need to compare nums[p] and the new item.
            if(p >= i){
                if(nums[p] <= nums[i+k-1]){
                    p = i+k-1;
                }
            } else {
                // p is not in the current window, so iterate the current window and record the index of the max num to p
                p = i;
                for(int j = i+1; j < i+k; j++){
                    if(nums[j] >= nums[p])
                        p = j;
                }
            }
            res[i] = nums[p];
        }
        return res;
    }
}