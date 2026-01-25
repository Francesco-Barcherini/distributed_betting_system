package it.unipi.distributed_betting_system.Controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class FrontendController {
    @GetMapping("/")
    public String root() {
        return "forward:/login.html";
    }
}
