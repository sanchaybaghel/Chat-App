import userAppStore from "@/store";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { HOST } from "@/utils/constants";
import { getColor } from "@/lib/utils";

const ContactList = ({ contacts, isChannel = false }) => {
  const {
    setSelectedChatData,
    setSelectedChatType,
    selectedChatData,
    setSelectedChatMessages,
  } = userAppStore();

  const handleClick = (contact) => {
    setSelectedChatType(isChannel ? "channel" : "contact");
    setSelectedChatData(contact);
    if (!selectedChatData || selectedChatData._id !== contact._id) {
      setSelectedChatMessages([]);
    }
  };

  return (
    <div className="mt-5">
      {contacts.map((contact) => {
        const isSelected =
          selectedChatData && selectedChatData._id === contact._id;
        return (
          <div
            key={contact._id}
            className={`pl-6 pr-2 py-2 rounded-lg transition-all duration-200 cursor-pointer
              ${isSelected
                ? "bg-[#8417ff] text-white shadow-md"
                : "hover:bg-[#ede9fe] hover:text-[#8417ff] text-neutral-300"
              }`}
            onClick={() => handleClick(contact)}
          >
            <div className="flex gap-4 items-center">
              {!isChannel && (
                <Avatar className="h-10 w-10 rounded-full overflow-hidden border border-[#e5e7eb] bg-[#23232b] flex items-center justify-center">
                  {contact.image ? (
                    <AvatarImage
                      src={
                        contact.image.startsWith("http")
                          ? contact.image
                          : `${HOST}/${contact.image}`
                      }
                      alt="profile"
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <span
                      className={`uppercase font-semibold text-lg flex items-center justify-center w-full h-full ${getColor(
                        contact.color
                      )}`}
                    >
                      {contact.firstName
                        ? contact.firstName[0]
                        : contact.email[0]}
                    </span>
                  )}
                </Avatar>
              )}
              {isChannel && (
                <div className="bg-[#e0e7ff] text-[#7c3aed] h-10 w-10 flex items-center justify-center rounded-full font-bold text-xl">
                  #
                </div>
              )}
              <span className={`ml-1 truncate ${isSelected ? "font-bold" : ""}`}>
                {isChannel
                  ? contact.name
                  : `${contact.firstName} ${contact.lastName}`}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ContactList;
//6:11:03