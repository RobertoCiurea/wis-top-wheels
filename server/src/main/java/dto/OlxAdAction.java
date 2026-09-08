package dto;

import com.fasterxml.jackson.annotation.JsonValue;

public enum OlxAdAction {
    ACTIVATE("activate"),
    DEACTIVATE("deactivate"),
    FINISH("finish"),
    EXTEND("extend");
    private final String command;
    OlxAdAction(String command){
        this.command = command;
    }

    @JsonValue
    public String getCommand(){
        return command;
    }
}
