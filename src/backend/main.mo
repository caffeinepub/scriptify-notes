import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Map "mo:core/Map";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Int "mo:core/Int";
import Iter "mo:core/Iter";
import Text "mo:core/Text";
import Order "mo:core/Order";
import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  public type Note = {
    id : Text;
    title : Text;
    createdAt : Time.Time;
    owner : Principal;
    pdfBlob : Storage.ExternalBlob;
  };

  public type UserProfile = {
    name : Text;
  };

  module Note {
    public func compareByTimestamp(note1 : Note, note2 : Note) : Order.Order {
      Int.compare(note1.createdAt, note2.createdAt);
    };
  };

  let noteStore = Map.empty<Text, Note>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func getAllNotesOfUser() : async [Note] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can access notes");
    };
    noteStore.values().toArray().filter<Note>(func(note) { note.owner == caller });
  };

  public query ({ caller }) func getAllNotesOfUserSortedByTimestamp() : async [Note] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can access notes");
    };
    noteStore.values().toArray().filter<Note>(func(note) { note.owner == caller }).sort<Note>(
      Note.compareByTimestamp,
    );
  };

  public query ({ caller }) func getFilteredNotesOfUserSortedByTimestamp(filter : Text) : async [Note] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can access notes");
    };
    let searchQuery = filter.toLower();
    noteStore.values().toArray().filter<Note>(func(note) { note.owner == caller }).filter<Note>(
        func(note) { note.title.toLower().contains(#text searchQuery) },
      ).sort<Note>(
      Note.compareByTimestamp,
    );
  };

  public shared ({ caller }) func saveNote(id : Text, title : Text, pdfBlob : Storage.ExternalBlob) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save notes");
    };
    noteStore.add(
      id,
      {
        id;
        title;
        createdAt = Time.now();
        owner = caller;
        pdfBlob;
      },
    );
  };

  public shared ({ caller }) func deleteNote(id : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can delete notes");
    };
    switch (noteStore.get(id)) {
      case (null) { Runtime.trap("Note does not exist") };
      case (?note) {
        if (note.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Must be owner or admin to delete");
        };
        noteStore.remove(id);
      };
    };
  };
};
