
FLEXBUILDER	:= mxmlc
NAME := microphone

main:
	$(FLEXBUILDER) -static-link-runtime-shared-libraries  ./lib/$(NAME).as -output $(NAME).swf 

clean:
	rm -f $(NAME).swf

