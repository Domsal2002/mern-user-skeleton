package csc300unittest;

import org.junit.Test; 
import static org.junit.Assert.*; 
  
public class MyJUnitTest { 
  
    @Test
    public void testSample() { 
        assertEquals(4, 2+2); 
    } 
} 